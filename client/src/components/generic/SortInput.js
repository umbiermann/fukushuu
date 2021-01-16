import { Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";

const SortInput = ({ options, selectedOption, onChange }) => {
  return (
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText>
          <i className="fas fa-sort"></i>
        </InputGroupText>
      </InputGroupAddon>
      <Input
        className="pl-1"
        type="select"
        name="sort"
        value={selectedOption}
        onChange={onChange}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </Input>
    </InputGroup>
  );
};

export default SortInput;
