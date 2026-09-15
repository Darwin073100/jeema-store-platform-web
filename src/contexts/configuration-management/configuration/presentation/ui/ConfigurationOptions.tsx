'use client'
import { useWorkspace } from '@/shared/ui/hooks/auth/useAuth';
import { FcCollaboration, FcComboChart, FcConferenceCall, FcDepartment, FcPrint, FcReadingEbook, FcSerialTasks, FcSettings} from 'react-icons/fc';
import { HideElement } from '@/contexts/authentication-management/auth/presentation/ui/HideElement';
import { LinkCard, LinkCardGrid } from '@/shared/ui/components/cards/LinkCard';
import { ConfigurationContainer } from './ConfigurationContainer';

const ConfigurationOptions = () => {
    const { employee } = useWorkspace();
    return (
        <>
            <ConfigurationContainer value='General' Icon={FcSettings}>
                <LinkCardGrid>
                    <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                        <LinkCard 
                            Icon={FcDepartment}
                            value='Establecimiento'
                            link='/configurations/establishment'/>
                        <LinkCard
                            value='Mi perfil'
                            Icon={FcReadingEbook}
                            link={`configurations/employees/${employee?.employeeId}`}/>
                        <LinkCard 
                            value='Usuarios'
                            Icon={FcConferenceCall}
                            link='/configurations/users' />
                        <LinkCard
                            value='Empleados'
                            Icon={FcCollaboration} 
                            link='/configurations/employees' />
                    </HideElement>
                </LinkCardGrid>
            </ConfigurationContainer>
            <ConfigurationContainer value='Información financiera' Icon={FcSerialTasks}>
                <LinkCardGrid>
                    <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                        <LinkCard
                            value='Movimientos generales'
                            Icon={FcComboChart} 
                            link='/configurations/transactions' />
                    </HideElement>
                </LinkCardGrid>
            </ConfigurationContainer>
            <ConfigurationContainer value='Impresiones' Icon={FcPrint}>
                <LinkCardGrid>
                    <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                        <LinkCard
                            value='Impresora térmica'
                            Icon={FcPrint} 
                            link='/configurations/printer' />
                    </HideElement>
                </LinkCardGrid>
            </ConfigurationContainer>
        </>
    )
}

export { ConfigurationOptions };
