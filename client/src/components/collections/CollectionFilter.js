import { Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";

const CollectionFilter = ({
  collections,
  selectedCollection,
  onChange,
  forceSelect,
}) => {
  return (
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        <InputGroupText>
          <i className="fas fa-book"></i>
        </InputGroupText>
      </InputGroupAddon>
      <Input
        className="pl-1"
        type="select"
        name="filterCollection"
        required={true}
        onChange={onChange}
        value={selectedCollection || ""}
      >
        {!forceSelect ? <option value={""}>All</option> : null}
        {collections.map((collection) => (
          <option key={collection._id} value={collection._id}>
            {collection.name}
          </option>
        ))}
      </Input>
    </InputGroup>
  );
};

export default CollectionFilter;
