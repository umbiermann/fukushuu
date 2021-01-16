import { Badge } from "reactstrap";
import HelpModal from "../info/HelpModal";

const LogListHelp = () => {
  return (
    <HelpModal name="Logs">
      <p>Discuss your original sentences!</p>
      <p>
        When you type in an original sentence while reviewing your Cards a Log
        will be created, that all other people in the Collection can see.
      </p>
      <p>
        <Badge color="secondary">2</Badge> displays the number of comments.
      </p>
      <p>Press the Log to see more information.</p>
      <p>
        Press <i className="fas fa-search fa-sm"></i> to put the Card's name in
        the searchbar, to quickly look for it in the Card list.
      </p>
      <p>
        You can comment on the log, to give feedback, discuss and help each
        other.
      </p>
    </HelpModal>
  );
};

export default LogListHelp;
