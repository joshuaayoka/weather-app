import React from "react"
import ReactDOM from "react-dom/client"



export default function SearchBar(props) {
    return (
        <form 
            className="search"
            onSubmit={props.handleSubmit}
            onChange={props.handleChange}
        >
                <input 
                    type="text"
                    placeholder="Search.."
                    name="location"
                    value={props.value}
                />
                <button>Go</button>
        </form>
    )
}