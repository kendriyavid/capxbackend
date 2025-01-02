import supabaseInstance from '../supabaseClient.js'
const supabase = supabaseInstance.getClient();

const getUserProfile = async (userId) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select()
            .eq('id', userId)
            .single();

        if (error || !user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        console.error('Get User Profile Error:', error);
        throw new Error('Server error');
    }
};

export {getUserProfile};