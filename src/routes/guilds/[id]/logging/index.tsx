import { Authorize } from '#/components/ErrorBoundary';
import { Spinner } from '@chakra-ui/react';
import { BASE_URI } from '#/lib/constants';
import useAPI from '#/lib/useAPI';
import { Formik } from 'formik';
import { useParams } from 'react-router-dom';

interface Config {
    logModerationActions: boolean;
    logsEnabled: boolean;
    logsChannel?: string;
}

const Logging: React.FC<{}> = ({}) => {
    const params = useParams();
    const { data, loading, error, code } = useAPI<Config>(`${BASE_URI}/guilds/${params.id}`);

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        if (code === 401) {
            return <Authorize />;
        }

        return <p>An error has occured.</p>;
    }

    if (data) {
        return (
            <>
                <div className="Utils__Leading">
                    <h2 className="Utils__Leading">Logging</h2>
                    <p>Customize Fluorine's logging system for this server.</p>
                </div>
                <Formik
                    initialValues={{
                        logsEnabled: data.logsEnabled,
                        logModerationActions: data.logModerationActions,
                        logsChannel: data.logsChannel ?? ''
                    }}
                    onSubmit={(values, actions) => {
                        setTimeout(async () => {
                            const patch = await fetch(`${BASE_URI}/guilds/${params.id}`, {
                                credentials: 'include',
                                method: 'PATCH',
                                body: JSON.stringify(values)
                            }).catch(err => {
                                throw new Error(err.message);
                            });

                            if (patch.status >= 500) {
                                throw new Error('Patch fail');
                            }

                            actions.setValues(values);
                            actions.setSubmitting(false);
                        }, 1000);
                    }}
                    enableReinitialize
                >
                    {props => {
                        return (
                            <form className="Form" onSubmit={props.handleSubmit}>
                                <div className="Form__CheckboxField">
                                    <input
                                        type="checkbox"
                                        name="logsEnabled"
                                        checked={props.values.logsEnabled}
                                        onChange={props.handleChange}
                                        className="Form__Checkbox"
                                    />
                                    <label className="Form__Label Utils__TextAlign">Enable Logs</label>
                                </div>

                                <div className="Form__CheckboxField">
                                    <input
                                        type="checkbox"
                                        name="logModerationActions"
                                        checked={props.values.logModerationActions}
                                        onChange={props.handleChange}
                                        className="Form__Checkbox"
                                        disabled={!props.values.logsEnabled}
                                    />
                                    <label className="Form__Label Utils__TextAlign">Log Moderation Actions</label>
                                </div>

                                <div className="Form__Field">
                                    <label className="Form__Label">Logs Channel</label>
                                    <input
                                        type="text"
                                        name="logsChannel"
                                        value={props.values.logsChannel}
                                        onChange={props.handleChange}
                                        className="Form__TextInput"
                                        disabled={!props.values.logsEnabled}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="Button Button--Primary"
                                    disabled={props.isSubmitting ? props.isSubmitting : !props.dirty}
                                >
                                    {props.isSubmitting ? 'hi' : 'Save changes'}
                                </button>
                            </form>
                        );
                    }}
                </Formik>
            </>
        );
    }

    return <></>;
};

export default Logging;
