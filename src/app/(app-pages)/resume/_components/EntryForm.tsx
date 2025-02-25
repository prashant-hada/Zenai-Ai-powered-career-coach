import { Button } from "@/components/ui/button";
import { resumeSchema } from "@/schema/resumeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, PlusCircle, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { improveWithAi } from "@/actions/resume";
import { toast } from "sonner";
import formatDisplayDate from "@/utils/dateFunction";
import { Entry } from "@/types/Entry";

const EntryForm = ({ type, entries, onChange }) => {
  const [isAdding, setisAdding] = useState(false);
  const {
    // control,
    register,
    handleSubmit: handleValidation,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  const {
    loading: isImproving,
    funct: improveWithAIfn,
    data: improvedContent,
    error: improveWithAiError,
  } = useFetch(improveWithAi);

  const handleDelete = (index: number) => {
    const newEntries = entries.filter((_:Entry, i:number)=> i !== index);
    onChange(newEntries);
  };

  const handleAddItemToList = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...entries, formattedEntry]);

    reset();
    setisAdding(false);
  });

  const handleImproveWithAI = async () => {
    const description = watch("description");
    const typeVal = type.toLowerCase();
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIfn(description, typeVal);
  };

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description updated succesfully!");
    }

    if (improveWithAiError) {
      toast.error(
        improveWithAiError.message || "Failed to Improve description."
      );
    }
  }, [isImproving, improvedContent, improveWithAiError, setValue]);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries.map((entry:Entry, index: number) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {entry.title}{" "}
                {entry.organization ? "a " + entry.organization : ""}
              </CardTitle>
              <Button
                variant={"outline"}
                size={"icon"}
                type="button"
                onClick={() => handleDelete(index)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {entry.current?
                `${entry.startDate} - Present`
                :`${entry.startDate} - ${entry.endDate}`  
              }
              </p>
              <p className="mt-2 text-sm whitespace-pre-wrap">
                {entry.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
              <div className="space-y-2">
                <Input placeholder="Title/Position" {...register("title")} />
                {typeof errors.title === "string" && (
                  <p className="text-sm text-red-500 font-medium">
                    {errors.title}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Organization/Company"
                  {...register("organization")}
                />
                {typeof errors.organization === "string" && (
                  <p className="text-sm text-red-500 font-medium">
                    {errors.organization}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 ">
              <div className="space-y-2">
                <Input
                  type="month"
                  placeholder="Start Date"
                  {...register("startDate")}
                />
                {typeof errors.startDate === "string" && (
                  <p className="text-sm text-red-500 font-medium">
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="month"
                  placeholder="End Date"
                  disabled={!!current}
                  {...register("endDate")}
                />
                {typeof errors.endDate === "string" && (
                  <p className="text-sm text-red-500 font-medium">
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                {...register("current")}
                onChange={(e) => {
                  setValue("current", e.target.checked);
                  if (e.target.checked) {
                    setValue("endDate", "");
                  }
                }}
              />
              <label htmlFor="current">Current {type}</label>
            </div>

            <div className="space-y-2 pt-2">
              <Textarea
                placeholder={`Description of yout ${type.toLowerCase()}`}
                className="h-32"
                {...register("description")}
              />
              {typeof errors.description === "string" && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.description}
                </p>
              )}
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleImproveWithAI}
              disabled={isImproving || !watch("description")}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin text-purple-600" />
                  <span className="text-purple-600 font-medium mr-1">
                    Improving...
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-1 text-purple-600 font-extrabold" />
                  <span className="text-purple-600 mr-1 font-semibold">
                    Improve with AI
                  </span>
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                reset();
                setisAdding(false);
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>

            <Button
              type="button"
              onClick={() => {
                handleAddItemToList();
              }}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isAdding && (
        <Button
          className="w-full"
          variant={"outline"}
          onClick={() => setisAdding(true)}
        >
          <Plus className=" h-4 w-4 mr-4" />
          Add {type}
        </Button>
      )}
    </div>
  );
};

export default EntryForm;
