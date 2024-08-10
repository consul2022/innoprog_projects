import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Container, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { CheckPointItem, ProjectItem, SubmissionItem } from '../models/types';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';
import Header from '../components/Header';
import { Circle } from '@mui/icons-material';

function Project() {
    // const checkPoints = 4;
    const [checkPoints, setCheckPoints] = useState<CheckPointItem[]>()
    const [project, setProject] = useState<ProjectItem>();
    const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
    const [executionStatus, setExecutionStatus] = useState<number>(0);
    const navigator = useNavigate();

    useEffect(() => {
        const projectId = window.location.pathname.split("/").pop();
        if (!projectId) return;
        ApiService.getProjectById(parseInt(projectId)).then(response => setProject(response.data))
        ApiService.getCheckPointsByProjectId(parseInt(projectId)).then(response => {
            setCheckPoints(response.data);
            for (let point of response.data) {
                ApiService.getSubmissionsByCheckPointId(point.id).then(response => {
                    console.log(response.data)
                    setSubmissions([...submissions, ...response.data.user_submissions])
                })
            }

        })
    }, [])
    // console.log(project)
    // console.log(checkPoints)
    console.log(submissions)

    function routeChange(id: number, index: number) {
        return () => {
            navigator('' + id, {
                state: {
                    id: index
                }
            });
        }
    }

    const toggleExecution = async () => {
        try {
            if(project == null) return;
            if(executionStatus == 0) {
                const response = await ApiService.postProjectExecution(project.id)
                console.log(response);
                setExecutionStatus(1);
            } else {
                const response = await ApiService.deleteProjectExecution(project.id)
                console.log(response);
                setExecutionStatus(0);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Box>
            <Header changeProjectsTab={() => { }} />
            <Container>
                <Button onClick={() => { navigator('/projects'); }}> Все Проекты</Button>

                <Box display={'flex'} alignItems={'center'}>
                    <Circle visibility={executionStatus > 0 ? 'visible' : 'hidden'}
                        color={executionStatus == 2 ? 'success' : 'warning'}
                        sx={{ mr: 1 }} />
                    <Typography mr={2} variant='h4' fontWeight="bold">{project?.name.toUpperCase()}</Typography>
                    <Chip color='primary' label={project?.difficulty} size='medium' />
                    <Box component={'img'} src={project?.company.logo} alt="Logo" style={{ marginLeft: 'auto', height: '50px' }} />
                </Box>
                <Box display={'flex'} m={2} >
                    <Button
                        sx={{ flex: 1, mr: 2 }}
                        variant={executionStatus == 0 ? 'contained' : 'outlined'}
                        onClick={toggleExecution}
                    >
                        {executionStatus == 0 ? 'Начать выполнение' : 'Отменить выполнение'}
                    </Button>
                    <Button sx={{ flex: 1, ml: 2 }} variant='contained' onClick={() => { navigator('/projects/create'); }}>Решения других разработчииков</Button>
                </Box>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"

                    >
                        <Typography variant='h5'>Описание</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {project?.description}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography variant='h5'>Чек-поинты</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            {checkPoints?.map((value, i) => <ListItemButton key={value.id} onClick={routeChange(value.id, i)}>
                                <ListItemIcon>
                                    <DoneIcon color={value.id > 1 ? 'warning' : 'success'}></DoneIcon>
                                </ListItemIcon>
                                <ListItemText primary={value.name} />
                            </ListItemButton>)}

                        </List>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography variant='h5'>Структура</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {project?.code_structure}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography variant='h5'>Критерии оценки</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {project?.assessment_criteria}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ArrowDropDownIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography variant='h5'>О заказчике</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            {project?.company.description}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Container>
        </Box>
    );
}

export default Project;