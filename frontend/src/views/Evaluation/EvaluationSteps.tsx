import React from 'react'
import { Evaluation, Progression, Role } from '../../api/models'
import { calcProgressionStatus } from '../../utils/ProgressionStatus'
import NominationView from './Nomination/NominationView'
import IndividualView from './Individual/IndividualView'
import PreparationView from './Preparation/PreparationView'
import WorkshopView from './Workshop/Questionaire/WorkshopView'
import QuestionnaireStatusTabs from '../../components/StatusTab'
import { progressionToString } from '../../utils/EnumToString'
import FollowUpTabs from './FollowUp/FollowUpTabs'
import WorkshopTabs from './Workshop/WorkshopTabs'
import { Link } from "react-router-dom";
import styled from 'styled-components'
import { Icon } from '@equinor/eds-core-react'
import { arrow_back_ios } from '@equinor/eds-icons'
import { Stepper, Step } from '@equinor/fusion-react-stepper';
import { useModuleCurrentContext } from '@equinor/fusion-framework-react-module-context'

const Wrapper = styled.div`
    padding: 20px 10px 0 10px;
`
const ProjectButton = styled(Link)`
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 30px;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    line-height: 10px;
    color: rgba(0, 112, 121, 1);
    cursor: pointer;
    
`
interface EvaluationViewProps {
    evaluation: Evaluation
    onProgressEvaluationClick: () => void
    onProgressParticipant: (newProgressions: Progression) => void
}

const EvaluationSteps = ({ evaluation, onProgressEvaluationClick, onProgressParticipant }: EvaluationViewProps) => {
    const currentProject = useModuleCurrentContext()

    if (currentProject === null || currentProject === undefined) {
        return <p>No project selected</p>
    }

    const allRoles = Object.values(Role)
    const activeStepKey = evaluation.progression !== Progression.Finished ? evaluation.progression : Progression.FollowUp

    // Return the new location that doesn't include the /evaluation part
    const getProjectTabsLink = (location: any) => {
        const newPath = location.pathname.split('/evaluation')[0]
        return ({ ...location, pathname: newPath })
    }

    return (
        <>
            <Wrapper>
                <ProjectButton to={(location: any) => getProjectTabsLink(location)}>
                    <Icon size={16} data={arrow_back_ios} />
                    Project dashboard
                </ProjectButton>
            </Wrapper>

            <Stepper forceOrder={false} activeStepKey={activeStepKey} hideNavButtons={true}>
                <Step
                    title={progressionToString(Progression.Nomination)}
                    description={calcProgressionStatus(evaluation.progression, Progression.Nomination)}
                    stepKey={Progression.Nomination}
                >
                    <NominationView evaluation={evaluation} onNextStep={() => onProgressEvaluationClick()} />
                </Step>
                <Step
                    title={progressionToString(Progression.Individual)}
                    description={calcProgressionStatus(evaluation.progression, Progression.Individual)}
                    stepKey={Progression.Individual}
                >
                    <QuestionnaireStatusTabs evaluation={evaluation} viewProgression={Progression.Individual} allowedRoles={allRoles}>
                        <IndividualView
                            evaluation={evaluation}
                            onNextStepClick={() => onProgressEvaluationClick()}
                            onProgressParticipant={onProgressParticipant}
                        />
                    </QuestionnaireStatusTabs>
                </Step>
                <Step
                    title={progressionToString(Progression.Preparation)}
                    description={calcProgressionStatus(evaluation.progression, Progression.Preparation)}
                    stepKey={Progression.Preparation}
                >
                    <QuestionnaireStatusTabs
                        evaluation={evaluation}
                        viewProgression={Progression.Preparation}
                        allowedRoles={[Role.OrganizationLead, Role.Facilitator]}
                    >
                        <PreparationView
                            evaluation={evaluation}
                            onNextStepClick={() => onProgressEvaluationClick()}
                            onProgressParticipant={onProgressParticipant}
                        />
                    </QuestionnaireStatusTabs>
                </Step>
                <Step
                    title={progressionToString(Progression.Workshop)}
                    description={calcProgressionStatus(evaluation.progression, Progression.Workshop)}
                    stepKey={Progression.Workshop}
                >
                    <WorkshopTabs evaluation={evaluation}>
                        <WorkshopView
                            evaluation={evaluation}
                            onNextStepClick={() => onProgressEvaluationClick()}
                            onProgressParticipant={onProgressParticipant}
                        />
                    </WorkshopTabs>
                </Step>
                <Step
                    title={progressionToString(Progression.FollowUp)}
                    description={calcProgressionStatus(evaluation.progression, Progression.FollowUp)}
                    stepKey={Progression.FollowUp}
                >
                    <FollowUpTabs evaluation={evaluation} onNextStepClick={() => onProgressEvaluationClick()} />
                </Step>
            </Stepper>
        </>
    )
}

export default EvaluationSteps
