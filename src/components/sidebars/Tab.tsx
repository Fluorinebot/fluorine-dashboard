import { Button, Heading, ListItem, useColorModeValue } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { NavLink } from 'react-router-dom';

export interface TabObject {
    tabName: string;
    tabURI: string;
    TabIcon: IconType;
    end?: boolean;
}

const Tab: React.FC<TabObject> = ({ TabIcon, tabURI, tabName, end }) => {
    return (
        <ListItem>
            <NavLink to={tabURI} end={end}>
                {({ isActive }) => (
                    <Button
                        gap={2}
                        colorScheme={isActive ? 'brand' : useColorModeValue('gray', 'white')}
                        iconSpacing={2}
                        leftIcon={<TabIcon size="36" />}
                        variant={isActive ? 'solid' : 'ghost'}
                    >
                        <Heading as="h5" size="md" fontWeight={600} marginBlock={'auto'}>
                            {tabName}
                        </Heading>
                    </Button>
                )}
            </NavLink>
        </ListItem>
    );
};

export default Tab;
