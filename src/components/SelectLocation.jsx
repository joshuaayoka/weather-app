import React from "react";

export default function SelectLocation(props) {

    const locations = props.locations

    const selectOptions = locations.map(location => {
        const {name, country, id} = location
        return <option key={id} value={id}>
            {name}, {country}
        </option>
    })
        
    return (
        <div className="select">
            <select
                className="select-location"
                id={props.id + "-locations"}
                name="locations"
                onChange={props.handleChoice}
                >
                    <option value="">Choose Location</option>
                    {selectOptions.length > 0 && selectOptions}
            </select>
        </div>
    )
}