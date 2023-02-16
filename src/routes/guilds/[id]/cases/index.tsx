import '#/assets/routes/guilds/[id]/cases/index.css';
import { Authorize } from '#/components/ErrorBoundary';
import { Spinner } from '@chakra-ui/react';
import CasesTable from '#/components/views/CasesTable';
import { BASE_URI } from '#/lib/constants';
import type { Case } from '#/lib/types';
import useAPI from '#/lib/useAPI';
import { Outlet, useParams } from 'react-router-dom';

export default function Cases() {
    const params = useParams();
    const { loading, data: caseData, code, error } = useAPI<Case[]>(`${BASE_URI}/guilds/${params.id}/cases`);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        if (code === 401) {
            return (
                <div className="container">
                    <Authorize />
                </div>
            );
        }

        return <p className="Utils__NoticeBox container">There was an error loading the cases, try again.</p>;
    }

    if (caseData) {
        return (
            <>
                {params.item && <Outlet />}
                {!params.item && (
                    <>
                        <div>
                            <h2 className="Utils__Leading">Cases</h2>
                            <p>The log of all moderation cases in this server.</p>
                        </div>
                        <CasesTable caseData={caseData} />
                    </>
                )}
            </>
        );
    }

    return <></>;
}
