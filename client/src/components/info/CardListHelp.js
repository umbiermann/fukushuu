import { Badge } from "reactstrap";
import HelpModal from "./HelpModal";

const CardListHelp = () => {
  return (
    <HelpModal name="Cards">
      <p>Here all your Cards are displayed.</p>
      <p>
        You can search for a Card by typing in the search bar, filter for
        certain Collections, or sort the list, either by the creation date of
        the Card, or by the date of the next review.
      </p>
      <p>
        Next to the card you see a badge, showing the days left to the next
        review of the Card.{" "}
      </p>
      <p>
        <Badge color="secondary">2</Badge> - Card has to be reviewed in 2 days
        again
        <br />
        <Badge color="success">
          <i className="fas fa-book-reader"></i>
        </Badge>{" "}
        - Card has to be reviewed
        <br />
        <Badge color="info">
          <i className="fas fa-book-reader"></i>
        </Badge>{" "}
        - New Card, has not been reviewed yet
      </p>
      <p>
        Clicking on a Card, you see the Card's information, edit, and delete
        them.
      </p>
      <h6 className="help-header">Toggle Furigana</h6>
      <p>
        By clicking on an Info field, you can see Furigana over the Kanji. As
        this is automatically created it takes some time and is not 100%
        accurate.
      </p>
    </HelpModal>
  );
};

export default CardListHelp;
