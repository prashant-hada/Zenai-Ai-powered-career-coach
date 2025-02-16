"use client  ";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, resumeSchema } from "@/schema/resumeSchema";
import useFetch from "@/hooks/useFetch";
import { saveResume } from "@/actions/resume";
import { Input } from "@/components/ui/input";

const ResumeBuilder = ({ initialContent }: { initialContent: string }) => {
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

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
      </div>
      <div className=" space-x-2">
        <Button variant={"destructive"}>
          <Save className="h-4 w-4" />
          Save
        </Button>
        <Button>
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Tabs defaultValue={activeTab}>
        <TabsList>
          <TabsTrigger value="edit" onClick={() => setActiveTab("edit")}>
            Account
          </TabsTrigger>
          <TabsTrigger value="preview" onClick={() => setActiveTab("preview")}>
            Password
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <form>
            <div className="">
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
