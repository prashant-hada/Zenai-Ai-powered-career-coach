import {useState } from "react";
import { toast } from "sonner"


const useFetch= (action)=>{
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState(null);

    const funct = async(...args)=>{
        setLoading(true);
        setError(null);

        try {
            const response = await action(...args);
            setData(response);
            setError(null);
        } catch (error) {
            setError(error);
            toast.error((error as Error).message)   
        }
        finally{
            setLoading(false);
        }
    }

    return {data , loading, error, funct, setData}
}

export default useFetch;