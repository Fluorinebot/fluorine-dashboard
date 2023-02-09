import { Authorize } from '#/components/ErrorBoundary';
import CasesTable from '#/components/views/CasesTable';
import { BASE_URI } from '#/lib/constants';
import type { Case } from '#/lib/types';
import useAPI from '#/lib/useAPI';
import { Outlet, useParams } from 'react-router-dom';

export default function Cases() {
    const params = useParams();
    const { loading, data: caseData, code, error } = useAPI<Case[]>(`${BASE_URI}/guilds/${params.id}/cases`);

    if (loading) {
        return <p className="noticeBox container">Loading all cases</p>;
    }

    if (error) {
        if (code === 401) {
            return (
                <div className="container">
                    <Authorize />
                </div>
            );
        }

        return <p className="noticeBox container">There was an error loading the cases, try again.</p>;
    }

    if (caseData) {
        return (
            <>
                <div>
                    <h2 className="Utils__Leading">Cases</h2>
                    <p>The log of all moderation cases in this server.</p>
                </div>

                {params.item && <Outlet />}
                {!params.item && <CasesTable caseData={caseData} />}
            </>
        );
    }

    return <></>;
}
