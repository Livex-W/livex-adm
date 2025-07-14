import { Metadata } from 'next';
import ResortsList from '@/components/resorts/ResortsList';

export const metadata: Metadata = {
    title: 'Livex Admin – Resort Management',
};

export default function ResortsPage() {

    return (
        <ResortsList />
    );
}
