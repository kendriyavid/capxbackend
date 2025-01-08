// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import generateTokens from '../utils/generateTokens.js';
// import supabaseInstance from '../supabaseClient.js'
// import {clientConnections} from '../cron.js'
// const supabase = supabaseInstance.getClient();

// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const { data: user, error } = await supabase
//             .from('users')
//             .select()
//             .eq('email', email)
//             .single();

//         if (error || !user) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password_hash);
//         if (!isPasswordValid) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         const tokens = await generateTokens(user);
//         res.status(200).json(tokens);
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// const register = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         const { data: existingUser } = await supabase
//             .from('users')
//             .select()
//             .eq('email', email)
//             .single();

//         if (existingUser) {
//             return res.status(400).json({ error: 'Email already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const { data, error } = await supabase
//             .from('users')
//             .insert([
//                 {
//                     username,
//                     email,
//                     password_hash: hashedPassword,
//                 },
//             ])
//             .select()
//             .single();

//         if (error) {
//             return res.status(400).json({ error: error.message });
//         }

//         const tokens = await generateTokens({ id: data.id, email });
//         res.status(201).json(tokens);
//     } catch (error) {
//         console.error('Register error:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };


// const refreshAccessToken = async (req, res) => {
//     try {
//         console.log("refresh")
//         const { refreshToken } = req.body;

//         // Verify the refresh token
//         const decoded = jwt.verify(refreshToken, process.env.VITE_REFRESH_TOKEN);
//         console.log("decoded")
//         // Fetch the user associated with the refresh token
//         const { data: user } = await supabase
//             .from('users')
//             .select()
//             .eq('id', decoded.id)
//             .eq('refresh_token', refreshToken)
//             .single();
        
//         console.log("user: ", user)

//         if (!user) {
//             return res.status(401).json({ error: 'Invalid refresh token' });
//         }

//         // Generate new tokens
//         const { accessToken, refreshToken: newRefreshToken} = await generateTokens(user);
//         console.log("newRefreshToken")
//         // Return both tokens to the client
//         res.status(200).json({ accessToken, refreshToken: newRefreshToken,user:{id:decoded.id} });
//     } catch (error) {
//         console.error('Refresh token error:', error);
//         res.status(401).json({ error: 'Invalid refresh token' });
//     }
// };


// const logout = async (req, res) => {
//     try {
//         const { id } = req.user;

//         await supabase
//             .from('users')
//             .update({ refresh_token: null })
//             .eq('id', id);
//         const connection = clientConnections.get(id);
//         if (connection) {
//             stockUpdates.removeListener('batchUpdate', connection.listener);
//             connection.response.end();
//             clientConnections.delete(id);
//         }
//         res.status(200).json({ message: 'Logged out successfully' });
//         } catch (error) {
//         console.error('Logout error:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };

// export { login, register, logout, refreshAccessToken };


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import generateTokens from '../utils/generateTokens.js';
import supabaseInstance from '../supabaseClient.js';
import { clientConnections, stockUpdates } from '../state.js';

const supabase = supabaseInstance.getClient();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .select()
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const tokens = await generateTokens(user);
        res.status(200).json(tokens);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const { data: existingUser } = await supabase
            .from('users')
            .select()
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    username,
                    email,
                    password_hash: hashedPassword,
                },
            ])
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const tokens = await generateTokens({ id: data.id, email });
        res.status(201).json(tokens);
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const decoded = jwt.verify(refreshToken, process.env.VITE_REFRESH_TOKEN);

        const { data: user } = await supabase
            .from('users')
            .select()
            .eq('id', decoded.id)
            .eq('refresh_token', refreshToken)
            .single();

        if (!user) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);

        res.status(200).json({ accessToken, refreshToken: newRefreshToken, user: { id: decoded.id } });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};

const logout = async (req, res) => {
    console.log("printing body")
    console.log(req.body)
    try {
        const { id } = req.body;

        await supabase
            .from('users')
            .update({ refresh_token: null })
            .eq('id', id);

        const connection = clientConnections.get(id);
        if (connection) {
            stockUpdates.removeListener('batchUpdate', connection.listener);
            connection.response.end();
            clientConnections.delete(id);
        }

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export { login, register, logout, refreshAccessToken };
