import { Button } from '@/components/ui/button';
import { resumeSchema } from '@/schema/resumeSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/useFetch';
import { improveWithAi } from '@/actions/resume';
import { toast } from 'sonner';


const EntryForm = ({type, entries, onChange}) => {
    const [isAdding, setisAdding] = useState(false);
    const {
        control,
        register,
        handleSubmit: handleValidation,
        reset,
        setValue,
        watch,
        formState: { errors },
      } = useForm({
        resolver: zodResolver(resumeSchema),
        defaultValues: {
          title:"",
          organization:"",
          startDate:'',
          endDate:'',
          description:'',
          current:false
        },
      });

      const current = watch("current");

      const {
        loading: isImproving,
        funct: improveWithAIfn,
        data: improvedContent,
        error: improveWithAiError
      } = useFetch(improveWithAi)

      const handleDelete = ()=>{}

      const handleAddItemToList = ()=>{}

      const handleImproveWithAI = async()=>{
        const description = watch ('description');
        const typeVal = type.toLowerCase()
        if(!description){
          toast.error("Please enter a description first");
          return;
        }

        await improveWithAIfn(
          description,
          typeVal
        )
      }

  return (
    <div className='space-y-4'>
      {isAdding && (
        <Card>
        <CardHeader>
          <CardTitle>Add {type}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pb-2'>
            <div className='space-y-2'>
              <Input
              placeholder='Title/Position'
              {...register("title")}
               />
              {typeof errors.title === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.title}
                    </p>
                  )}
            </div>
            <div className='space-y-2'>
              <Input
              placeholder='Organization/Company'
              {...register("organization")}
               />
              {typeof errors.organization === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.organization}
                    </p>
                  )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 '>
            <div className='space-y-2'>
              <Input
              type='month'
              placeholder='Start Date'
              {...register("startDate")}
               />
              {typeof errors.startDate === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.startDate}
                    </p>
                  )}
            </div>
            <div className='space-y-2'>
              <Input
              type='month'
              placeholder='End Date'
              disabled = {!!current}
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
            <input type="checkbox"
            id='current'
            {...register('current')}
            onChange={(e)=>{
              setValue('current', e.target.checked);
              if(e.target.checked){
                setValue('endDate','');
              }
            }} />
            <label htmlFor='current'>Current {type}</label>
          </div>

          <div className="space-y-2 pt-2">
            <Textarea 
            placeholder={`Description of yout ${type.toLowerCase()}`}
            className='h-32'
            {...register('description')}
            />
            {typeof errors.description === "string" && (
                    <p className="text-sm text-red-500 font-medium">
                      {errors.description}
                    </p>
                  )}
          </div>
          <Button
          type='button' 
          size='sm'
          onClick={handleImproveWithAI}
          disabled={isImproving || !watch('description')}
          >
            {isImproving?(
              <>
                <Loader2 className='h-4 w-4 mr-2 animate-spin text-purple-600' />
                <span className='text-purple-600 font-medium mr-1'>Improving...</span>
              </>
            ): (
              <>
                <Sparkles className='h-4 w-4 mr-1 text-purple-600 font-extrabold animate-spin' />
                <span className='text-purple-600 mr-1 font-semibold'>Improve with AI</span>
              </>
            )}

          </Button>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
      
      )}

      {!isAdding && (
        <Button 
         className='w-full'
         variant={'outline'}
         onClick={()=> setisAdding(true)}>
          <Plus className=' h-4 w-4 mr-4'/>
          Add {type}
        </Button>
      )}
    </div>
  )
}

export default EntryForm