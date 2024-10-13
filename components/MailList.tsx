"use client"
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import MailBody from './MailBody';
import { useDispatch, useSelector } from 'react-redux';
import { markAsRead } from '@/redux/mailSlice';
import { RootState } from '@/redux/store';
import { motion } from 'framer-motion';

interface Email {
    id: string;
    from: {
        email: string;
        name: string;
    };
    date: number;
    subject: string;
    short_description: string;
}

interface SelectedEmail {
    id: string;
    name: string;
    date: string;
    subject: string;
    body: string;
}

const emailsPerPage = 10;

const MailList = () => {
    const [emailList, setEmailList] = useState<Email[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedEmail, setSelectedEmail] = useState<SelectedEmail | null>(null);
    const [filter, setFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const dispatch = useDispatch();
    const readEmails = useSelector((state: RootState) => state.mail.readEmails);
    const favoriteEmails = useSelector((state: RootState) => state.mail.favoriteEmails);

    useEffect(() => {
        const fetchEmail = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("https://flipkart-email-mock.vercel.app/");
                const { list } = await res.json();
                setEmailList(list);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEmail();
    }, []);

    const formatDate = useCallback((date: number) => {
        const dateObj = new Date(date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        const timeStr = dateObj.toLocaleTimeString(undefined, {
            hour: "2-digit", minute: "2-digit", hour12: true
        }).replace(' ', '').toLowerCase();

        return `${day}/${month}/${year} ${timeStr}`;
    }, []);

    const fetchEmailBody = useCallback(async (id: string) => {
        try {
            const res = await fetch(`https://flipkart-email-mock.now.sh/?id=${id}`);
            const { body } = await res.json();
            return body;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error while fetching the Email Body: ${error.message}`);
            } else {
                console.error("An unknown error occurred.");
            }
            return 'Failed to load email body.';
        }
    }, []);    

    const handleEmailClick = useCallback(async (email: Email) => {
        dispatch(markAsRead(email.id));
        const body = await fetchEmailBody(email.id);
        setSelectedEmail({
            id: email.id,
            name: email.from.name,
            date: formatDate(email.date),
            subject: email.subject,
            body,
        });
    }, [dispatch, formatDate, fetchEmailBody]);

    const filteredEmailList = useMemo(() => {
        switch (filter) {
            case 'unread':
                return emailList.filter(email => !readEmails.includes(email.id));
            case 'read':
                return emailList.filter(email => readEmails.includes(email.id));
            case 'favorites':
                return emailList.filter(email => favoriteEmails.includes(email.id));
            default:
                return emailList;
        }
    }, [emailList, filter, readEmails, favoriteEmails]);

    const currentEmails = useMemo(() => {
        const indexOfLastEmail = currentPage * emailsPerPage;
        return filteredEmailList.slice(indexOfLastEmail - emailsPerPage, indexOfLastEmail);
    }, [filteredEmailList, currentPage]);

    const totalPages = Math.ceil(filteredEmailList.length / emailsPerPage);

    const handlePageChange = useCallback((pageNumber: number) => setCurrentPage(pageNumber), []);
    const toggleFilter = useCallback((newFilter: string) => {
        setFilter(prevFilter => prevFilter === newFilter ? 'all' : newFilter);
        setCurrentPage(1);
    }, []);

    return (
        <main>
            <nav>
                <ul className="text-black flex items-center gap-3 text-lg font-semibold">
                    <li className='py-3'>Filter By:&nbsp;&nbsp;&nbsp;</li>
                    <li className={`cursor-pointer ${filter === 'unread' && 'bg-[#F2F2F2] text-[#717171] rounded-full px-3 border-2 border-[#CFD2DC]'}`} onClick={() => toggleFilter('unread')}>Unread</li>
                    <li className={`cursor-pointer ${filter === 'read' && 'bg-[#F2F2F2] text-[#717171] rounded-full px-3 border-2 border-[#CFD2DC]'}`} onClick={() => toggleFilter('read')}>Read</li>
                    <li className={`cursor-pointer ${filter === 'favorites' && 'bg-[#F2F2F2] text-[#717171] rounded-full px-3 border-2 border-[#CFD2DC]'}`} onClick={() => toggleFilter('favorites')}>Favorites</li>
                </ul>
            </nav>
            <section className="w-full flex gap-5 mt-5 xl:mt-8">
                <aside className={`border-0 w-full ${selectedEmail && "xl:w-[30%] hidden xl:block"}`}>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className={`flex flex-col gap-3 xl:gap-5`}>
                            {currentEmails.map(email => (
                                <motion.div
                                    key={email.id}
                                    className={`border-2 rounded-lg px-3 py-3 xl:px-5 flex gap-2 xl:gap-4 cursor-pointer
                                        ${readEmails.includes(email.id) ? 'bg-[#F2F2F2]' : 'bg-white'}
                                        ${selectedEmail?.id === email.id ? 'border-[#E54065]' : 'border-[#CFD2DC]'}`}
                                    onClick={() => handleEmailClick(email)}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}>
                                    <span className="min-w-10 max-w-10 min-h-10 max-h-10 bg-[#E54065] text-white flex items-center justify-center rounded-full text-lg font-semibold">
                                        {email.from.name.charAt(0).toUpperCase()}
                                    </span>
                                    <div className="w-11/12">
                                        <p>Form&nbsp;<strong>{`${email.from.name} <${email.from.email}>`}</strong></p>
                                        <p>Subject:&nbsp;<strong>{email.subject}</strong></p>
                                        <p className="my-2 xl:my-3" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {email.short_description}
                                        </p>
                                        <p className="flex gap-5">
                                            <span>{formatDate(email.date)}</span>
                                            {favoriteEmails.includes(email.id) && (
                                                <span className='text-[#E54065] font-semibold cursor-pointer'>Favorite</span>
                                            )}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                            {/* Pagination Controls */}
                            <div className="flex justify-center gap-2 mt-5">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index}
                                        className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-gray-300" : ""
                                            }`}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
                {selectedEmail && <MailBody data={selectedEmail} unSelect={() => setSelectedEmail(null)} />}
            </section>
        </main>
    );
};

export default MailList;