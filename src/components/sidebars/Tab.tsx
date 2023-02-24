import { Button, Heading, ListItem, useColorModeValue } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { NavLink } from 'react-router-dom';

export interface TabObject {
    tabName: string;
    tabURI: string;
    tabIcon: IconType;
    end?: boolean;
}

const Tab: React.FC<TabObject> = props => {
    return (
        <ListItem>
            <NavLink to={props.tabURI} end={props.end}>
                {({ isActive }) => (
                    <Button
                        gap={2}
                        colorScheme={isActive ? 'brand' : useColorModeValue('black', 'white')}
                        iconSpacing={2}
                        leftIcon={<props.tabIcon size="36" />}
                        variant={isActive ? 'solid' : 'ghost'}
                    >
                        <Heading as="h5" size="md" fontWeight={600} marginBlock={'auto'}>
                            {props.tabName}
                        </Heading>
                    </Button>
                )}
            </NavLink>
        </ListItem>
    );
};

export default Tab;
