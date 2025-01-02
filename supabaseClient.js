import {createClient} from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.VITE_SUPABASE_URL);
class supabaseClient {
    static instance = null;
    constructor() {
        if (supabaseClient.instance) {
            return supabaseClient.instance;
        }

        this.supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

        supabaseClient.instance = this;
    }
    getClient() {
        return this.supabase;}
}


const supabaseInstance = new supabaseClient();
export default supabaseInstance;