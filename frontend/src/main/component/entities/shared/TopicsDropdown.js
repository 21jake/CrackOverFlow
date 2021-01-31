import Select from 'react-select';
import { Row, Label } from 'reactstrap';
import Axios from '../../../api/Axios'
import { useStyles, useEffect, useState } from 'react';


const TopicsDropdown = (props) => {
    const [topics, setTopics] = useState([{value: "", label: ""}]);
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

    return (
        <>
            <Label>
                <span>Chọn chủ đề</span>
            </Label>
            <Select 
                onChange={props.onTopicsChange}
                value={props.defaultOption}
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