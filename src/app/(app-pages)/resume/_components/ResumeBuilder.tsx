"use client";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  resumeSchema } from "@/schema/resumeSchema";
import useFetch from "@/hooks/useFetch";
import { saveResume } from "@/actions/resume";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EntryForm from "./EntryForm";

const ResumeBuilder = ({ initialContent }: { initialContent?: string }) => {
  const [activeTab, setActiveTab] = useState("edit");

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

  const onSubmitFn = async(data)=>{

  }

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
      <div className=" space-x-2">
        <Button variant={'outline'}>
          <Save className="h-4 w-4 text-purple-600" />
          <span className=" text-purple-600">Save</span>
        </Button>
        <Button>
          <Download className="h-4 w-4" />
          Download PDF
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
        <TabsContent value="preview">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
