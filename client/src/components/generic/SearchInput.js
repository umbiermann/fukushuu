import { Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";

const SearchInput = ({ search, setSearch }) => {
  return (
    <InputGroup className="mb-3">
      <InputGroupAddon addonType="prepend">
        <InputGroupText>
          <i className="fas fa-search"></i>
        </InputGroupText>
      </InputGroupAddon>
      <Input
        type="text"
        name="search"
        placeholder="search"
        autoComplete="off"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </InputGroup>
  );
};

export default SearchInput;
