// @ts-nocheck

const SALT = import.meta.env.VITE_TOKEN_SALT || "SKYWARE_SECRET_"; 
const SEPARATOR = "_||_"; 

export const encodeToken = (token) => {
    if (!token) return null;
    try {
     
        const dynamicTimestamp = Date.now().toString(36); 
        
    
        const saltedToken = SALT + dynamicTimestamp + SEPARATOR + token;
        
       
        const base64Str = btoa(saltedToken);
        
       
        return base64Str.split('').reverse().join('');
    } catch (error) {
        console.error("Token encoding error:", error);
        return null;
    }
};

export const decodeToken = (encodedToken) => {
    if (!encodedToken) return null;
    try {
        
        const base64Str = encodedToken.split('').reverse().join('');
        
       
        const saltedToken = atob(base64Str);
        
       
        const parts = saltedToken.split(SEPARATOR);
        
    
        if (parts.length === 2) {
            return parts[1]; 
        }
        
        return null; 
    } catch (error) {
        console.error("Token decoding error:", error);
        return null;
    }
};