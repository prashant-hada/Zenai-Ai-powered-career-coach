"use client";
import Industry from "@/types/Industry";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/schema/onboardingSchema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateUser } from "@/actions/user";

interface OnboradingFormProps {
  industries: Industry[];
}

const OnboradingForm = ({ industries }: OnboradingFormProps) => {
  const [selectedIndusty, setSelectedIndusty] = useState<Industry | null>(null);
  const router = useRouter();

  const {
    loading: updateLoading,
    funct: updateUserFunct,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const watchIndustry = watch("industry");
  const submitHandler = async (values: FieldValues) => {
    try {
        const formattedIndustry = `${values.industry}-${values.subIndustry}`
            .toLowerCase()
            .replace(/ /g,"-");

        await updateUserFunct({
            ...values, industry:formattedIndustry
        })
    } catch (error) {
        console.error('Onboarding Error: ',error);
    }
  };

  useEffect(()=>{
    if(updateResult?.success && !updateLoading){
        toast.success('Profile Updated Successfully!');
        router.push('/dashboard');
        router.refresh();
    }
  },[updateResult, updateLoading, router])
  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-xl mt-8 mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Select your Industry to get personalized career insights and
            recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground ">
            All the fields marked with * are mandatory.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
            <div className=" space-y-2">
              <Label htmlFor="industry">
                Industry<strong>*</strong>
              </Label>
              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndusty(
                    industries.find((ind) => ind.id === value) || null
                  );
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {typeof errors.industry?.message === "string" && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {watchIndustry && (
              <div className=" space-y-2">
                <Label htmlFor="subIndustry">
                  Sub Industry<strong>*</strong>
                </Label>
                <Select
                  onValueChange={(value) => setValue("subIndustry", value)}
                >
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select a Sub Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIndusty?.subIndustries.map((subInd: string) => (
                      <SelectItem key={subInd} value={subInd}>
                        {subInd}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {typeof errors.subIndusry?.message === "string" && (
                  <p className="text-sm text-red-500 font-medium">
                    {errors.subIndusry.message}
                  </p>
                )}
              </div>
            )}
            <div className=" space-y-2">
              <Label htmlFor="experience">
                Years of Experience<strong>*</strong>
              </Label>
              <Input
                id="experience"
                type="number"
                min={0}
                max={50}
                placeholder="Enter you years of experience"
                {...register("experience")}
              />
              {typeof errors.experience?.message === "string" && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.experience.message}
                </p>
              )}
            </div>
            <div className=" space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                placeholder="e.g. Java, Pyhton, JavaScript..."
                {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas
              </p>
              {typeof errors.skills?.message === "string" && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.skills.message}
                </p>
              )}
            </div>

            <div className=" space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                placeholder="Tell us about your professional experience"
                className="h-32"
                {...register("bio")}
              />
              {/* <p className='text-sm text-muted-foreground'>Separate multiple skills with commas</p> */}
              {typeof errors.bio?.message === "string" && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.bio.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={updateLoading}>
              {updateLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ):('Complete Profile')
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboradingForm;
