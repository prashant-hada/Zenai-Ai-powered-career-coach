import {useState } from "react";
import { toast } from "sonner"


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useFetch=  <T, A extends any[]>(action: (...args: A) => Promise<T>)=>{
    const [data, setData] = useState<T | undefined |null>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error|null>(null);

    const funct = async(...args:A)=>{
        setLoading(true);
        setError(null);

        try {
            const response = await action(...args);
            setData(response);
            setError(null);
        } catch (error) {
            setError(error as Error);
            toast.error((error as Error).message)   
        }
        finally{
            setLoading(false);
        }
    }

    return {data , loading, error, funct, setData}
}

export default useFetch;