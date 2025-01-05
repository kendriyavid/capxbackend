import supabaseInstance from '../supabaseClient.js'
const supabase = supabaseInstance.getClient();

import jwt from 'jsonwebtoken';


const generateTokens = async (user) => {
    console.log("generating the token");
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.VITE_JWT_SECRET,
        { expiresIn: '5m' }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.VITE_REFRESH_TOKEN,
        { expiresIn: '7d' }
    );

    await supabase
        .from('users')
        .update({
            refresh_token: refreshToken,
            last_login: new Date(),
            token_expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        })
        .eq('id', user.id);

    return { accessToken, refreshToken, user:{id:user.id} };
};

export default generateTokens;