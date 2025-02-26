"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Download, Edit, File, Loader2, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  resumeSchema } from "@/schema/resumeSchema";
import useFetch from "@/hooks/useFetch";
import { saveResume } from "@/actions/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./EntryForm";
import entriesToMarkDown from "@/utils/markdown";
import { useUser } from "@clerk/nextjs";
import html2pdf from "html2pdf.js";
import MDEditor from '@uiw/react-md-editor'
import { toast } from "sonner";

const ResumeBuilder = ({ initialContent }: { initialContent?: string }) => {
  const [activeTab, setActiveTab] = useState("edit");
  const [resumePreviewMode, setResumePreviewMode] = useState(true);
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  // const [resumeMode, setResumeMode] = useState("preview");
  const [isGenerating, setIsGenerating] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {
        email: "",
        mobile: "",
        linkedIn: "",
        twitter: "",
      },
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    funct: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  const formValues = watch();

  const onSubmitFn = async()=>{
      try {
        await saveResumeFn(previewContent);
      } catch (error) {
        console.error('Error in Saving Resume', error);
      }
  }

  function toTitleCase(str:string) {
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  }
  

  const getContactMarkdown = useCallback(() => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedIn)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedIn})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${toTitleCase(user?.fullName || "")}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  }, [formValues, user?.fullName])

  const getCombinedContent = useCallback(()=>{
    const {summary, experience, skills, projects, education} = formValues;

    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkDown(experience, 'Work Experience'),
      entriesToMarkDown(education, 'Education'),
      entriesToMarkDown(projects, 'Projects'),
    ].filter(Boolean)
    .join("\n\n");
  }, [formValues, getContactMarkdown])

  const generatePDF = async()=>{
    setIsGenerating(true);
    try {
      const resumeElement = document.getElementById('resume-pdf');
      const options = {
        margin:[15,15],
        filename: `${user?.fullName ? user.firstName:''}-resume.pdf`,
        image:{type:'jpeg', quality: 0.98},
        html2canvas:{scale:2},
        jsPDF :{unit:'mm', format: 'a4', orientation: 'portrait'},
      }
      await html2pdf().set(options).from(resumeElement).save();

      toast.success('Your Resume will be downloaded soon.')
    } catch (error) {
      console.error('PDF generation error: ', error);
      toast.error((error as Error).message || 'Some went wrong while generting PDF' )
      
    }
    finally{
       setIsGenerating(false)
    }

  }

  //UseEffect to save resume content in DB
  useEffect(()=>{
    if(saveResult && !isSaving){
      toast.success('Resume save successfully!');
    }

    if(saveError){
      toast.error(saveError.message || "Failed to save the resume")
    }
  },[saveResult, saveError, isSaving])

  //Sets the initial content in the resume preview if we have a resume in DB corresponding to the user
  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  //updates form content whenever the value changes or tabs switch
  useEffect(()=>{
    if(activeTab == 'edit'){
      const newContent = getCombinedContent();
      setPreviewContent(prev=> (newContent? newContent: prev))
    }
  },[formValues, activeTab, getCombinedContent]) 



  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
      <div className=" space-x-2">
        <Button variant={'outline'} disabled={isSaving} >
        {isSaving?(
            <>
            <Loader2 className="h-4 w-4 text-purple-600" />
          <span className=" text-purple-600">Saving</span>
            </>
          ):(
            <>
            <Save className="h-4 w-4 text-purple-600" />
            <span className=" text-purple-600">Save</span>
            </>
          )}
        </Button>
        <Button onClick={generatePDF} disabled={isGenerating}>
          {isGenerating?(
            <>
            <Loader2 className="h-4 w-4" />
            Generating PDF...
            </>
          ):(
            <>
            <Download className="h-4 w-4" />
            Download PDF
            </>
          )}
        </Button>
      </div>
      </div>

      <Tabs defaultValue={activeTab}>
        <TabsList>
          <TabsTrigger value="edit" onClick={() => setActiveTab("edit")}>
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" onClick={() => setActiveTab("preview")}>
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmitFn)}>
            <div className="space-y-8 pt-4">
              {/* Contact Info Section */}
            <div className="space-y-2 ">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your@email.com"
                  />
                  {typeof errors.contactInfo?.email === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.contactInfo?.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+91 7412856965"
                  />
                  {typeof errors.contactInfo?.mobile === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.contactInfo?.mobile}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn Profile</label>
                  <Input
                    {...register("contactInfo.linkedIn")}
                    type="url"
                    placeholder="https://linkedin.com/your-profile"
                  />
                  {typeof errors.contactInfo?.linkedIn === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.contactInfo?.linkedIn}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">X Profile</label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://x.com/your-handle"
                  />
                  {typeof errors.contactInfo?.twitter === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.contactInfo?.twitter}
                    </p>
                  )}
                </div>
              </div>
            </div>
                  {/* Summary */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary..."
                  />
                )}
              />
              {typeof errors.summary === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.summary}
                    </p>
                  )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary..."
                  />
                )}
              />
              {typeof errors.skills === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.skills}
                    </p>
                  )}
            </div>

{/* Work Experience Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                  type='Experience'
                  entries={field.value}
                  onChange={field.onChange}
                 />
                )}
              />
              {typeof errors.experience === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.experience}
                    </p>
                  )}
            </div>

{/* Education Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                  type='Education'
                  entries={field.value}
                  onChange={field.onChange}
                 />
                )}
              />
              {typeof errors.education === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.education}
                    </p>
                  )}
            </div>

{/* Projects Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                 <EntryForm
                  type='Projects'
                  entries={field.value}
                  onChange={field.onChange}
                 />
                )}
              />
              {typeof errors.projects === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.projects}
                    </p>
                  )}
            </div>

            </div>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          <Button
          variant={'link'} 
          type="button"
          className="mb-2" 
          onClick={()=> setResumePreviewMode(prev=>!prev)}
          >
            {resumePreviewMode ? 
            <>
            <Edit className="h-4 w-4" />
            Edit Resume
            </>
            :<>
            <File className="h-4 w-4" />
            Show Preview
            </>
            }
          </Button>

          {!resumePreviewMode && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-500 text-yellow-500 rounded mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                You will lose edited markdown progress if you update the form
              </span>
            </div>
          )}

          <div className=" border rounded-lg">
            <MDEditor
            value={previewContent}
            onChange={setPreviewContent}
            height={800}
            preview={resumePreviewMode? 'preview': 'edit'} />
          </div>

          <div className="hidden">
            <div id='resume-pdf'>
            <div className=" border rounded-lg">
            <MDEditor.Markdown
            source={previewContent}
            style={{
              background:'white',
              color: 'black',
            }}
            />
          </div>
            </div>
          </div>

        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
