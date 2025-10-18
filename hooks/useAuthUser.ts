"use client"

import { useState, useEffect } from "react";
import { supabase } from "@/lib/db/supabaseClient";
import { User } from "@supabase/supabase-js"
 
export const useAuthUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) {
                    setError(error.message);
                } else {
                    setUser(user);
                }
            } catch (err) {
                setError('Erreur lors de la récupération de l\'utilisateur');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
                
                if (event === 'SIGNED_OUT') {
                    setUser(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) {
                setError(error.message);
            } else {
                setUser(null);
            }
        } catch (err) {
            setError('Erreur lors de la déconnexion');
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, error, logout };
}

export const useLogout = () => {
    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error);
        }
    };
    return logout;
}