import React from 'react';
import { loadProgressBar } from "axios-progress-bar";
import axios from 'axios'
import {DataTable} from 'primereact/datatable';
import {Column} from "primereact/column";
import jwtDecode from 'jwt-decode';
import {FullCalendar} from 'primereact/fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import frLocale from '@fullcalendar/core/locales/fr';
import {Button} from "primereact/button";
import { Calendar } from 'primereact/calendar';

export default class Course extends React.Component {

    state = {
        courses: [],
        events: [],
        meeting: '',
        options: {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
            defaultView: 'timeGridWeek',
            defaultDate: '2017-02-01',
            header: {
                left: 'prev,next',
                center: 'title',
                // right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            editable: true,
            locale: frLocale,
        },
        is_creating: false,
        students: null,
    }

    componentDidMount() {
        loadProgressBar()
        axios.get('courses')
            .then(({data}) => {
                const events = data.data.confirmed.map(event => {
                    return  {
                        id: event.id,
                        start: event.meeting_date,
                        title: `courses_${event.id}`,
                        end: event.end,
                    }
                })
                this.setState({courses: data.data.waiting, events})
            })
            .catch(() => {
                alert('not ok')
            })
    }

    actionTemplate = (rowData, column) => {
        return (
            <div className="d-flex justify-content-center">
                <Button className="btn btn-success btn-xs" icon="pi pi-pencil" label="accept" onClick={() => {
                    loadProgressBar()
                    console.log(rowData)
                    axios.post('courses/accept/'+rowData.id)
                        .then(() => {
                            const copy = [...this.state.courses]
                            const index = copy.findIndex(item => rowData.id === item.id)
                            const event_copy = [...this.state.events]
                            if (index >= 0){
                                copy.splice(index,1)
                                this.setState({courses:copy})

                                const events = {
                                    id: rowData.id,
                                    start: rowData.meeting_date,
                                    title: `courses_${rowData.id}`,
                                    end: rowData.end,
                                }
                                event_copy.push(events)
                                this.setState({events:event_copy})
                            }
                        })
                        . catch(() => {
                            alert('not ok')
                        })
                }}/>
            </div>
        )
    }

    handleCreateEvent = () => {
        this.setState({is_creating:!this.state.is_creating})
        if (!this.state.students){
            axios.get('users?is_student=1')
                .then((data) => {
                    this.setState({students:data})
                })
                .catch(() => {
                    alert('not ok')
                })
        }
    }

    render() {
        const footer = <Button label="create" onClick={this.handleCreateEvent} icon="pi pi-plus"/>
        const formulaire = (
            <React.Fragment>
                <label htmlFor="language" className="text-secondary">Create Language :</label>
                <Calendar showTime hourFormat="24" className="w-25" name="meeting_date" value={this.state.meeting} onChange={(e) => this.setState({meeting: e.value})}/>
                <button className="btn btn-success btn-xs mt-1" type="button" onClick={this.onClickHandler}>Submit The Language</button>
            </React.Fragment>
        )
        const token = localStorage.getItem('token')
        const {is_student} = jwtDecode(token)
        let content = null
        if (!is_student){
            content = (
            <React.Fragment>
                <DataTable value={this.state.courses}
                           footer={footer}
                           header="Courses"
                           paginatorPosition="both"
                           selectionMode="single"
                           paginator={true}
                            className="mb-5 text-center">
                    <Column field="id" header="ID" sortable={true} />
                    <Column field="meeting_date" header="Date" sortable={true} />
                    <Column field="is_done" header="Done" sortable={true} />
                    <Column field="name" header="student name" sortable={true} />
                    <Column body={this.actionTemplate} header="Action" />
                </DataTable>
                {
                    this.state.is_creating ? formulaire : null
                }
                <hr/>
               <div className="container mt-5">
                   <FullCalendar events={this.state.events} options={this.state.options} />
               </div>
            </React.Fragment>
            )
        } else {
            content = (
                <div>Etudiant</div>
            )
        }
        return (
            <div className="container-fluid">
                <div className="p-grid">
                    <div className="p-col-12">
                        <div className="card card-w-title">
                            <h1>Courses</h1>
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}