import { useFormik } from 'formik';
import { BASE_URI } from '../../lib/constants';
import { useFetch } from '../../lib/useFetch';
import { Authorize } from '../ErrorBoundary';
import styles from './ProfileEdit.module.css';

interface Profile {
    userId?: string | bigint;
    description?: string;
    location?: string;
    pronouns?: string;
    website?: string;
    birthday?: string;
}

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
    const data = useFetch<Profile, { error: string; userId: string | bigint }>(`${BASE_URI}/profile`, {
        method: 'GET'
    });

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

    let JSXReturn;

    if (!data) {
        JSXReturn = <p>Loading your profile</p>;
    }

    if (data && 'error' in data && data.error !== 'User does not have a profile') {
        if (['Missing token', 'Invalid token'].includes(data.error)) {
            JSXReturn = <Authorize />;
        } else {
            JSXReturn = <p>There was an error loading your profile, try again.</p>;
        }
    }

    if ((data && 'userId' in data) || (data && 'userId' in data && 'error' in data)) {
        JSXReturn = (
            <div>
                <h2 className="headingTwo textHeading">Your Profile</h2>
                <p>Change your profile here.</p>
                <form onSubmit={formik.handleSubmit}>
                    <div className={styles.formField}>
                        <label className={styles.formLabel}>Description</label>
                        <textarea
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            className={styles.textarea}
                        />
                        {formik.touched.description && formik.errors.description ? (
                            <p className={styles.error}>{formik.errors.description}</p>
                        ) : null}
                    </div>

                    <div className={styles.formField}>
                        <label className={styles.formLabel}>Pronouns</label>
                        <input
                            name="pronouns"
                            type="text"
                            value={formik.values.pronouns}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.pronouns && formik.errors.pronouns ? (
                            <p className={styles.error}>{formik.errors.pronouns}</p>
                        ) : null}
                    </div>

                    <div className={styles.formField}>
                        <label className={styles.formLabel}>Birthday</label>
                        <input
                            name="birthday"
                            type="text"
                            value={formik.values.birthday}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.birthday && formik.errors.birthday ? (
                            <p className={styles.error}>{formik.errors.birthday}</p>
                        ) : null}
                    </div>

                    <div className={styles.formField}>
                        <label className={styles.formLabel}>Website</label>
                        <input
                            name="website"
                            type="text"
                            value={formik.values.website}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.website && formik.errors.website ? (
                            <p className={styles.error}>{formik.errors.website}</p>
                        ) : null}
                    </div>

                    <div className={styles.formField}>
                        <label className={styles.formLabel}>Location</label>
                        <input
                            name="location"
                            type="text"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                        />
                        {formik.touched.location && formik.errors.location ? (
                            <p className={styles.error}>{formik.errors.location}</p>
                        ) : null}
                    </div>

                    <button
                        type="submit"
                        className="ctaButton"
                        disabled={formik.isSubmitting ? formik.isSubmitting : !formik.dirty}
                    >
                        {formik.isSubmitting ? 'Saving changes...' : 'Save changes'}
                    </button>
                </form>
            </div>
        );
    }

    return <div className="paddedContainer">{JSXReturn}</div>;
}
