import { useState, useEffect } from "react";
import {useParams, useNavigate} from 'react-router-dom'
import {motion, AnimatePresence} from  'framer-motion'
import {Users, CheckCircle2, AlertCircle,  ArrowRight, Loader2, Sparkles} from 'lucide-react'
import { useAuth } from "@/hooks/useAuth";
import{joinTeamByInviteCode, getTeamByInviteCode} from '../lib/supabase/teams'

export function JoinTeamPage(){
    const{inviteCode} = useParams<{inviteCode: string}>()
    const {user} = useAuth()
    const navigate = useNavigate()

    const[status, setStatus] = useState<'preview' | 'joining' | 'success' | 'error'>('preview')
    const [teamInfo, setTeamInfo] = useState<{id: string, name: string, memberCount?: number} | null>(null)
    const [errorMessage, setErrorMessage] = useState('')

    //fetch team preview on mount
    useEffect(()=>{
        async function fetchPreview(){
            if(!inviteCode) return
            try{
                const team = await getTeamByInviteCode(inviteCode)
                setTeamInfo(team)
            }catch(err){
                setStatus('error')
                setErrorMessage('This invite link is invalid or has expired')
            }
        }
        fetchPreview()
    },[inviteCode])

    const handleJoin = async ()=>{
        if(!user || !inviteCode) return

        try{
            setStatus('joining')
            const team = await joinTeamByInviteCode(inviteCode, user.id)
            setStatus('success')

            setTimeout(()=>{
                navigate(`/teams/${team.id}`)
            }, 2000)
        }catch(err){
            setStatus('error')
            setErrorMessage(err instanceof Error ? err.message :'Failed to join workspace')
        }
    }

    const containerVariants = {
        initial: {opacity: 0, scale:0.9},
        animate:{opacity: 1, scale: 1},
        exit:{opacity:0, scale:1.1}
    };

    return(
        <div className='min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6'>
            <AnimatePresence mode="wait">
                {/*Logged out state*/}
                {!user &&(
                    <motion.div key='logged-out' {...containerVariants}
                    className="text-center max-w-sm">
                        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                         <Users className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3'>You're invited</h1>
                        <p className="text-slate-500 mb-8 leading-relaxed">Please sign in to your TaskPilot account to join this workspace</p>
                        <button
                          onClick={()=> navigate('/login')}
                          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            Get started <ArrowRight className='w-4 h-4'/>
                        </button>
                    </motion.div>
                )}

                {/*preview and joining state*/}
                {user && (status == 'preview'  || status == 'joining') && (
                    <motion.div key='preview' {...containerVariants} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-slate-200/50 dark:shadow-none text-center max-w-md w-full">
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className='absolute inset-0 bg-primary/20 rounded-full animate-ping' />
                            <div className='relative z-10 w-full h-full bg-primary rounded-[2.5rem] flex items-center justify-center'>
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h2 className="text-xs font-black text-primary uppercase tracking-[0.3rem] mb-2">Invitation</h2>
                        <h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4'>
                            Join {teamInfo?.name || 'workspace'}?
                        </h1>
                        <p className="text-slate-500 text-sm mb-10 leading-relaxed">
                            Accepting this invite will give you access to the team's dashboard, tasks and members.
                        </p>

                        <button
                          onClick={handleJoin}
                          disabled={status == 'joining' || !teamInfo}
                          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {status == 'joining' ? (
                                <>
                                 <Loader2 className="w-4 h-4 animate-spin" /> Finalizing...
                                </>
                            ):(
                                <>Accept & Join Workspace <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </motion.div>
                )}

                {/*sucess state*/}
                {status == 'success' && (
                    <motion.div key='success' {...containerVariants} className="text-center">
                        <CheckCircle2 className='w-20 h-20 text-emerald-200 mx-auto mb-6' />
                        <h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight'>Access Granted</h1>
                        <p className="text-slate-500 mt-2">Welcome to the team. Preparing your dashboard...</p>
                    </motion.div>
                )}

                {/*error state*/}
                {status == 'error' && (
                    <motion.div key='error' {...containerVariants} className="text-center max-w-sm">
                        <AlertCircle className='w-20 h-20 text-rose-500 mx-auto mb-6' />
                        <h1 className='text-2xl font-black text-slate-900 dark:text-white tracking-tight'>Link expired</h1>
                        <p className="text-slate-500 mt-2 mb-8">{errorMessage}</p>
                        <button
                         onClick={()=> navigate('/teams')}
                         className='w-full py-4 border-2 border-slate-200 dark:border-slate-800 text-slate-600dark:text-slate-400 rounded-2xl font-bold'
                        >Back to Safety</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
 }