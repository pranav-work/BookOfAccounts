import { useEffect, useState } from 'react';
import api from '../services/api';

interface HealthCheckResponse {
    status: string;
    message: string;
    version: string;
}

function useBackendStatus() {
    const [data, setData] = useState<HealthCheckResponse | null>(null);
    useEffect(() => {
        const checkBackend = async () => {
            try {
                const res = await api.get<HealthCheckResponse>('health-check/');
                setData(res.data);
            } catch {
                setData(null)
            }
        };
        checkBackend();
    }, []);
    return data;
}
export default useBackendStatus;
