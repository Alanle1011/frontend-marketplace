import React, { useState } from 'react';

const TraitInput = ({ onAddTrait }) => {
    const [trait, setTrait] = useState('');
    const [value, setValue] = useState('');

    const handleAddTrait = () => {
        if (trait && value) {
            onAddTrait({ trait, value });
            setTrait('');
            setValue('');
        }
    };

    return (
        <div>
            <label>
                Trait:
                <input type="text" value={trait} onChange={(e) => setTrait(e.target.value)} />
            </label>
            <label>
                Value:
                <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
            </label>
            <button onClick={handleAddTrait}>Add Trait</button>
        </div>
    );
};

const TraitList = ({ traits }) => (
    <ul>
        {traits.map((item, index) => (
            <li key={index} >
                {item.trait}: {item.value} 
            </li>
        ))}
    </ul>
);

export {TraitInput, TraitList};