import * as React from "react";
import '../sass/custom-bulma.scss';
import {Divider} from "../components/layout/Divider";
import {PageTitle} from "../components/layout/PageTitle";
import {SystemIndexTable} from "../components/SystemIndexComponents/SystemIndexTable";
import {SearchBar} from "../components/SystemIndexComponents/SearchBar"

//import * as sample from "./SystemViewComponents/SampleSystem.json";

export interface SystemIndexProps {

}

export interface SystemIndexState {
    snapshotArray: any[]
}
export class SystemIndex extends React.Component<SystemIndexProps, SystemIndexState> {

    render() {
        return (
            <div className="container">
                <SearchBar/>
                <PageTitle title={"Systems"}/>
                <Divider/>
                <SystemIndexTable/>
            </div>
        )
    }
}