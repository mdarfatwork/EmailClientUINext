"use client"
import React, { useMemo, useCallback } from 'react';
import { markAsFavorite, unmarkAsFavorite } from '@/redux/mailSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const convertBodyToParagraphs = (htmlString: string): string[] => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    return Array.from(tempDiv.querySelectorAll('p'))
        .map(p => p.textContent?.trim() || '')
        .filter(Boolean);
};

// Define the type for SelectedEmail
interface SelectedEmail {
    id: string;
    name: string;
    date: string;
    subject: string;
    body: string;
}

interface MailBodyProps {
    data: SelectedEmail;
    unSelect: () => void;
}

const MailBody: React.FC<MailBodyProps> = ({ data, unSelect }) => {
    const paragraphs = useMemo(() => convertBodyToParagraphs(data.body), [data.body]);
    const dispatch = useDispatch();

    const favoriteEmails = useSelector((state: RootState) => state.mail.favoriteEmails);

    const isFavorite = useMemo(() => favoriteEmails.includes(data.id), [favoriteEmails, data.id]);

    const toggleFavorite = useCallback(() => {
        if (isFavorite) {
            dispatch(unmarkAsFavorite(data.id));
        } else {
            dispatch(markAsFavorite(data.id));
        }
    }, [isFavorite, data.id, dispatch]);


    return (
        <section className={`bg-white border-2 rounded-lg p-4 xl:p-8 min-h-max h-[85vh] w-full xl:w-[65%] right-0 xl:right-10 xl:fixed`}>
            <span onClick={unSelect} className='block xl:hidden mb-2'>
                <svg fill="#000000" width="25px" height="25px" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" id="arrow" transform="scale(-1, 1) translate(-15, 0)">
                    <path d="M8.29289 2.29289C8.68342 1.90237 9.31658 1.90237 9.70711 2.29289L14.2071 6.79289C14.5976 7.18342 14.5976 7.81658 14.2071 8.20711L9.70711 12.7071C9.31658 13.0976 8.68342 13.0976 8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929L11 8.5H1.5C0.947715 8.5 0.5 8.05228 0.5 7.5C0.5 6.94772 0.947715 6.5 1.5 6.5H11L8.29289 3.70711C7.90237 3.31658 7.90237 2.68342 8.29289 2.29289Z" />
                </svg>
            </span>
            <article className="xl:w-full xl:flex">
                <section className="xl:w-1/12">
                    <div className="w-14 h-14 bg-[#E54065] text-white flex items-center justify-center rounded-full text-xl font-semibold">
                        {data.name.toUpperCase()?.charAt(0)}
                    </div>
                </section>
                <section className="xl:w-11/12">
                    <div className="flex flex-col gap-4 w-full mt-3 xl:mt-0">
                        <div className="flex justify-between">
                            <h1 className="text-3xl font-bold">{data.name}</h1>
                            <span
                                onClick={toggleFavorite}
                                className="text-white h-min py-2 text-xs rounded-full bg-[#E54065] flex justify-center items-center px-5 font-bold cursor-pointer">
                                {isFavorite ? 'Unfavorite' : 'Mark as Favorite'}
                            </span>
                        </div>
                        <p>{data.date}</p>
                        {paragraphs.map((para, index) => (
                            <p className='mb-4' key={index}>{para}</p>
                        ))}
                    </div>
                </section>
            </article>
        </section>
    )
}

export default MailBody;