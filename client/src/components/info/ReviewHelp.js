import HelpModal from "./HelpModal";

const CardListHelp = () => {
  return (
    <HelpModal name="Cards">
      <p>
        For practicing, you can write an original sentence using the content of
        this Card.
      </p>
      <p>
        When you are ready, you can press 'Check Answer' to see the Card's
        information.
      </p>
      <h6 className="help-header">Feedback</h6>
      <p>Then you can give feedback about the Card's difficulty:</p>
      <p>
        Every Card has a Level, starting from Level 0. If a Card is Level 0, it
        will get asked the next day again. With every level, the time to the
        next review increases exponentially.
      </p>
      <p>
        "Forgot" - sets the Level back to 0<br />
        "Good" - increases Level by 1<br />
        "Easy" - increases Level by 2<br />
      </p>
      <p>
        That way, you will review the Cards you don't remember yet more often
        and those you remember well less often.
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
