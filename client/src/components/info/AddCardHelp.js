import HelpModal from "./HelpModal";

const CardListHelp = () => {
  return (
    <HelpModal name="Cards">
      <h6>Type</h6>
      <p>
        You can choose between two Card types: Grammar and Vocabulary. These
        just change the Information you can put on the Card.
      </p>
      <h6>Collection</h6>
      <p>
        A Collection is like a deck for cards. If you don't have a collection
        yet, you can create one at <i className="fas fa-plus"></i>.<br />
        If you have a Collection, you can edit it at{" "}
        <i className="fas fa-cog"></i>.<br />
        There you can invite other people to your collection using their mail
        adress. That way you can work on and study collections together.
      </p>
      <p>
        Go to <i className="fas fa-user"></i> -&gt; Invitations to join a
        Collection. You can join the Example Collection here or join other
        user's Collections if you get invited.
      </p>
      <h6>Name</h6>
      <p>
        The Name of the Card. This is what you see first when reviewing the
        Card.
      </p>
      <h6>Other Fields</h6>
      <p>
        The other Info you want to put on the Card. These depend on the Card
        type.
      </p>
    </HelpModal>
  );
};

export default CardListHelp;
