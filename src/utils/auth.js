export function saveToken(t){ localStorage.setItem('sc_token', t); }
export function getToken(){ return localStorage.getItem('sc_token'); }
export function logout(){ localStorage.removeItem('sc_token'); }
