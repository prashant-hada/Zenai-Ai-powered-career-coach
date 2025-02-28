"use client";
import { generateCoverLetter } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { coverletterSchema } from "@/schema/coverletterSchema";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const CoverLetterGenerator = () => {
  const [displayForm, setDisplayForm] = useState(true);
  const [markdownContent, setMarkdownContent] = useState("");
  const { user } = useUser();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(coverletterSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      description: "",
    },
  });
  const formValues = watch();

  const {
    loading: isGenerating,
    data: coverLetterContent,
    error: generatingError,
    funct: generateFn,
  } = useFetch(generateCoverLetter);

  const onSubmit = async (data) => {
    const formattedData = {
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      jobDescription: data.description,
    };
    try {
      await generateFn(formattedData);
    } catch (error) {
      console.error("Error, while generating: ", error);
      throw error;
    }
  };

  function toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  }

  const getCombinedContent = useCallback(() => {
    const { companyName, jobTitle } = formValues;

    const resultString = `## Cover Letter

      **Company Name:** ${companyName}  
      **Job Title:** ${jobTitle}  

      Dear Hiring Manager,

      I am excited to apply for the **${jobTitle}** position at **${companyName}**. With my experience and skills, I am confident in my ability to contribute effectively to your team.

      ${coverLetterContent}

      I look forward to the opportunity to discuss how my background aligns with your needs. Thank you for your time and consideration.

      Best regards,  
      ${toTitleCase(user?.fullName || "")}`;

    return resultString;
  },[formValues, user?.fullName, coverLetterContent])

  useEffect(() => {
    if(!isGenerating && coverLetterContent ){
      
    }
  }, [coverLetterContent, isGenerating, generatingError, getCombinedContent]);

  return (
    <>
      {displayForm ? (
        <>
          <div className="border rounded-lg px-5 py-5 space-y-5">
            <div className="">
              <h2>Job Details</h2>
              <p className="text-sm text-muted-foreground">
                {" "}
                Provide information about the position you&apos;re applying for
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    {...register("companyName")}
                    type="text"
                    placeholder="Enter Company name here"
                    disabled={isGenerating}
                  />
                  {typeof errors.companyName === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <Input
                    {...register("jobTitle")}
                    type="text"
                    placeholder="Enter Job title here"
                    disabled={isGenerating}
                  />
                  {typeof errors.jobTitle === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.jobTitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Job Description</h3>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="h-44"
                      placeholder="Enter the job decription here"
                      disabled={isGenerating}
                    />
                  )}
                />
                {typeof errors.description === "string" && (
                  <p className="text-sm text-red-500 font-medium">
                    {errors.description}
                  </p>
                )}
              </div>
            </form>

            <div className=" flex items-center justify-center md:justify-end">
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="text-purple-500" />
                    <span className="text-sm font-medium text-purple-500">
                      Generating... Please wait
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="text-purple-500" />
                    <span className="text-sm font-medium text-purple-500">
                      Generate Cover Letter
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default CoverLetterGenerator;
