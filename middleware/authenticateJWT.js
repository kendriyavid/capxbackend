import jwt from  'jsonwebtoken';
import supabaseInstance from '../supabaseClient.js'
const supabase = supabaseInstance.getClient();


const authenticateJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader);

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access Token Missing or Malformed' });
        }

        const token = authHeader.split(' ')[1];

        const user = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.VITE_JWT_SECRET, {
                algorithms: ['HS256'],
                maxAge: '2m'  // Extra validation for token age
            }, (err, decoded) => {
                if (err) reject(err);
                resolve(decoded);
            });
        });

        // Optional: Verify user still exists and is active
        const { data: activeUser } = await supabase
            .from('users')
            .select('id, is_active')
            .eq('id', user.id)
            .single();

        if (!activeUser?.is_active) {
            return res.status(401).json({ message: 'User Inactive' });
        }

        req.user = user;
        next();
    } catch (err) {
        const errors = {
            TokenExpiredError: 403, 
            JsonWebTokenError: 401,
            NotBeforeError: 401
            };
        
    return res.status(errors[err.name] || 401).json({
        message: err.name === 'TokenExpiredError' ? 'Token Expired' : 'Authentication Failed'
    });
    }
};

export default authenticateJWT;