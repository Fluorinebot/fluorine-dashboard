import { useFormik } from 'formik';
import { BASE_URI } from '#/lib/constants';
import useAPI from '#/lib/useAPI';
import { Authorize } from '#/components/ErrorBoundary';
import '#/assets/components/views/ProfileEdit.css';
import type { Profile } from '#/lib/types';

const validate = async ({ description, location, birthday, pronouns, website }: Profile) => {
    const errors: Profile = {};

    if (description && description.length > 300) {
        errors.description = `Description must be less than 300 characters. You're off by ${
            description.length - 300
        } character(s).`;
    }

    if (location) {
        if (location.length < 3) {
            errors.location = 'Location must be more than 3 characters.';
        }

        if (location.length > 15) {
            errors.location = `Location must be less than 15 characters. You're off by ${
                location.length - 15
            } character(s).`;
        }
    }

    if (birthday) {
        const [day, month] = birthday.split('/').map(str => parseInt(str) || 0);

        if (day > 31 || day < 1 || month > 12 || month < 1) {
            errors.birthday = 'Not a valid birthday. Use DD/MM format!';
        }
    }

    if (website) {
        const regex =
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,20}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gu;

        if (!website.match(regex)) {
            errors.website = 'Not a valid website URL.';
        }
    }

    if (pronouns && !['she/her', 'he/him', 'they/them'].includes(pronouns)) {
        errors.pronouns = 'Pronouns other than (she/her, he/him and they/them) are not supported.';
    }

    return errors;
};

export default function ProfileEdit() {
    const { data, error, loading, code } = useAPI<Profile, { error: string; userId: string | bigint }>(
        `${BASE_URI}/profile`
    );

    const formik = useFormik({
        initialValues: {
            userId: data && 'userId' in data ? data.userId : '',
            location: data && 'location' in data ? data.location : '',
            birthday: data && 'birthday' in data ? data.birthday : '',
            pronouns: data && 'pronouns' in data ? data.pronouns : '',
            website: data && 'website' in data ? data.website : '',
            description: data && 'description' in data ? data.description : ''
        },
        onSubmit: (values, actions) => {
            setTimeout(async () => {
                const patch = await fetch(`${BASE_URI}/profile`, {
                    credentials: 'include',
                    method: 'PATCH',
                    body: JSON.stringify(values)
                }).catch(err => {
                    throw new Error(err.message);
                });

                if (patch.status >= 500) {
                    throw new Error('Patch fail');
                }

                actions.setSubmitting(false);
            }, 1000);
        },
        validate: validate,
        enableReinitialize: true
    });

    if (loading) {
        return <p>Loading your profile</p>;
    }

    if (error && code !== 404) {
        if (code === 401) {
            return <Authorize />;
        }

        return <p>There was an error loading your profile, try again.</p>;
    }

    if (data || (error && code !== 404)) {
        return (
            <div>
                <h2 className="Utils__Leading">Your Profile</h2>
                <p>Change your profile here.</p>
                <form className="Form" onSubmit={formik.handleSubmit}>
                    <div className="Form__Field">
                        <label className="Form__Label">Description</label>
                        <textarea
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            className="Form__TextInput"
                        />
                        {formik.touched.description && formik.errors.description ? (
                            <p className="Form__Error">{formik.errors.description}</p>
                        ) : null}
                    </div>

                    <div className="Form__Field">
                        <label className="Form__Label">Pronouns</label>
                        <input
                            name="pronouns"
                            type="text"
                            value={formik.values.pronouns}
                            onChange={formik.handleChange}
                            className="Form__TextInput"
                        />
                        {formik.touched.pronouns && formik.errors.pronouns ? (
                            <p className="Form__Error">{formik.errors.pronouns}</p>
                        ) : null}
                    </div>

                    <div className="Form__Field">
                        <label className="Form__Label">Birthday</label>
                        <input
                            name="birthday"
                            type="text"
                            value={formik.values.birthday}
                            onChange={formik.handleChange}
                            className="Form__TextInput"
                        />
                        {formik.touched.birthday && formik.errors.birthday ? (
                            <p className="Form__Error">{formik.errors.birthday}</p>
                        ) : null}
                    </div>

                    <div className="Form__Field">
                        <label className="Form__Label">Website</label>
                        <input
                            name="website"
                            type="text"
                            value={formik.values.website}
                            onChange={formik.handleChange}
                            className="Form__TextInput"
                        />
                        {formik.touched.website && formik.errors.website ? (
                            <p className="Form__Error">{formik.errors.website}</p>
                        ) : null}
                    </div>

                    <div className="Form__Field">
                        <label className="Form__Label">Location</label>
                        <input
                            name="location"
                            type="text"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            className="Form__TextInput"
                        />
                        {formik.touched.location && formik.errors.location ? (
                            <p className="Form__Error">{formik.errors.location}</p>
                        ) : null}
                    </div>

                    <button
                        type="submit"
                        className="Button Button--Primary"
                        disabled={formik.isSubmitting ? formik.isSubmitting : !formik.dirty}
                    >
                        {formik.isSubmitting ? 'Saving changes...' : 'Save changes'}
                    </button>
                </form>
            </div>
        );
    }

    return <></>;
}
