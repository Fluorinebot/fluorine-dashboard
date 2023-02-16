import { BASE_URI } from '#/lib/constants';
import { Profile } from '#/lib/types';
import {
    Box,
    Button, Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input, Text,
    Textarea,
    useToast
} from '@chakra-ui/react';
import { useFormik } from 'formik';

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

const EditProfile: React.FC<{ code: number; data?: Profile }> = ({ data, code }) => {
    const toast = useToast();

    const formik = useFormik({
        initialValues: {
            userId: data && 'userId' in data ? data.userId ?? '' : '',
            location: data && 'location' in data ? data.location ?? '' : '',
            birthday: data && 'birthday' in data ? data.birthday ?? '' : '',
            pronouns: data && 'pronouns' in data ? data.pronouns ?? '' : '',
            website: data && 'website' in data ? data.website ?? '' : '',
            description: data && 'description' in data ? data.description ?? '' : ''
        },
        onSubmit: (values, actions) => {
            if (Object.values(validate(values)).length > 0) {
                toast({
                    title: 'Form is invalid!',
                    description: 'Check your input and try again.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true
                });

                actions.setSubmitting(false);
                return;
            }

            setTimeout(async () => {
                const patch = await fetch(`${BASE_URI}/profile`, {
                    credentials: 'include',
                    method: 'PATCH',
                    body: JSON.stringify(values, (key, value) => {
                        return value === '' ? null : value;
                    })
                });

                if (!patch.ok) {
                    toast({
                        title: 'Something went wrong!',
                        status: 'error',
                        duration: 9000,
                        isClosable: true
                    });
                } else {
                    toast({
                        title: 'Saved changes.',
                        status: 'success',
                        duration: 9000,
                        isClosable: true
                    });
                }

                actions.setSubmitting(false);
            }, 1000);
        },
        validate: validate,
        enableReinitialize: true
    });

    return (
        <>
            <Flex direction={'column'} gap={2}>
                <Heading as="h2" size="xl" fontWeight={800}>
                    Your profile
                </Heading>
                <Text size="md" fontWeight={400}>
                    Change your profile here. {code === 404 && 'You currently do not have a profile!'}
                </Text>
            </Flex>

            <Divider marginY={4} />

            <Box>
                <form onSubmit={formik.handleSubmit}>
                    <Flex direction={'column'} gap={4}>
                        <FormControl isInvalid={Boolean(formik.touched.description && formik.errors.description)}>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                id="description"
                                name="description"
                                onChange={formik.handleChange}
                                value={formik.values.description}
                            />
                            {formik.touched.description && formik.errors.description ? (
                                <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
                            ) : null}
                        </FormControl>

                        <FormControl isInvalid={Boolean(formik.touched.pronouns && formik.errors.pronouns)}>
                            <FormLabel>Pronouns</FormLabel>
                            <Input
                                type="text"
                                id="pronouns"
                                name="pronouns"
                                onChange={formik.handleChange}
                                value={formik.values.pronouns}
                            />
                            {formik.touched.pronouns && formik.errors.pronouns ? (
                                <FormErrorMessage>{formik.errors.pronouns}</FormErrorMessage>
                            ) : null}
                        </FormControl>

                        <FormControl isInvalid={Boolean(formik.touched.birthday && formik.errors.birthday)}>
                            <FormLabel>Birthday</FormLabel>
                            <Input
                                type="text"
                                id="birthday"
                                name="birthday"
                                onChange={formik.handleChange}
                                value={formik.values.birthday}
                            />
                            {formik.touched.birthday && formik.errors.birthday ? (
                                <FormErrorMessage>{formik.errors.birthday}</FormErrorMessage>
                            ) : null}
                        </FormControl>

                        <FormControl isInvalid={Boolean(formik.touched.website && formik.errors.website)}>
                            <FormLabel>Website</FormLabel>
                            <Input
                                type="text"
                                id="website"
                                name="website"
                                onChange={formik.handleChange}
                                value={formik.values.website}
                            />
                            {formik.touched.website && formik.errors.website ? (
                                <FormErrorMessage>{formik.errors.website}</FormErrorMessage>
                            ) : null}
                        </FormControl>

                        <FormControl isInvalid={Boolean(formik.touched.location && formik.errors.location)}>
                            <FormLabel>Location</FormLabel>
                            <Input
                                type="text"
                                id="location"
                                name="location"
                                onChange={formik.handleChange}
                                value={formik.values.location}
                            />
                            {formik.touched.location && formik.errors.location ? (
                                <FormErrorMessage>{formik.errors.location}</FormErrorMessage>
                            ) : null}
                        </FormControl>

                        <Button
                            type="submit"
                            isLoading={formik.isSubmitting}
                            loadingText="Updating Profile"
                            disabled={formik.isSubmitting ? formik.isSubmitting : formik.dirty}
                            colorScheme={'brand'}
                            width={'fit-content'}
                        >
                            Update Profile
                        </Button>
                    </Flex>
                </form>
            </Box>
        </>
    );
};

export default EditProfile;
