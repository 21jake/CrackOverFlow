import Select from 'react-select';
import { Label } from 'reactstrap';
import Axios from '../../../api/Axios'
import { useEffect, useState } from 'react';


const TopicsDropdown = (props) => {
    const [topics, setTopics] = useState([{ value: "", label: "" }]);
    const convertRawTopicData = (input) => {
        const output = input.map((e) => (
            {
                value: e.id,
                label: e.name
            }
        ))
        return output;
    }

    const getAllTopics = async () => {
        try {
            const res = await Axios.get('/topics/getAll');
            if (res.status === 200) {
                const output = convertRawTopicData(res.data.data);
                setTopics(output);
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllTopics();
    }, []);


    // const options = [
    //     { value: 'chocolate', label: 'Chocolate' },
    //     { value: 'strawberry', label: 'Strawberry' },
    //     { value: 'vanilla', label: 'Vanilla' }
    // ]
    const customStyles = {
        control: styles => ({
            ...styles,
            // width: '300px'

        }),
        option: styles => ({
            ...styles,

        }),
        menu: styles => ({
            ...styles,
            // width: '200px'
        })

    };

    const returnDefaultOption = () => {
        if (!props.defaultOption) {
            return undefined;
        }
        if (typeof props.defaultOption === "number") {
            return topics.find(e => e.value === props.defaultOption)
        } else {
            return props.defaultOption
        }

        
    }

    // console.log(props.defaultOption, 'props.defaultOption');
    return (
        <>
            <Label>
                <span>Chọn chủ đề</span>
            </Label>
            <Select
                key={`reactSelectKey${props.defaultOption}`}
                onChange={props.onTopicsChange}
                value={returnDefaultOption()}
                // value={props.defaultOption}
                options={topics}
                isMulti={props.isMultiple}
                placeholder="Danh sách chủ đề"
                isClearable
                isSearchable
                styles={customStyles} />

        </>
    )
}

export default TopicsDropdown;