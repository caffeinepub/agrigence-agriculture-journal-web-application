import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";

module {
  type EditorialMember = {
    id : Nat;
    name : Text;
    qualification : Text;
    role : Text;
    expertise : Text;
    email : Text;
    phone : Text;
    isEditorialBoardAuthor : Bool;
    isEditorInChief : Bool;
    isReviewerBoardMember : Bool;
    createdAt : Time.Time;
    profilePictureUrl : Text;
    blob : ?Storage.ExternalBlob;
  };

  type OldActor = {
    editorialMembers : Map.Map<Nat, EditorialMember>;
  };

  type NewActor = {
    editorialMembers : Map.Map<Nat, EditorialMember>;
  };

  public func run(old : OldActor) : NewActor {
    if (old.editorialMembers.isEmpty()) {
      let newMember : EditorialMember = {
        id = 1;
        name = "Dr. Dinesh Kumar Singh";
        qualification = "Asst. Professor, National P.G. College, Barahalganj, Gorakhpur,";
        role = "Editor-in-Chief";
        expertise = "Editor-in-Chief";
        email = "dinesh_kumar_singh@barahalganj.edu.in";
        phone = "+91-1234567890";
        isEditorialBoardAuthor = false;
        isEditorInChief = true;
        isReviewerBoardMember = false;
        createdAt = 0;
        profilePictureUrl = "";
        blob = null;
      };
      let newMembers = Map.fromIter<Nat, EditorialMember>([(1, newMember)].values(), );
      { editorialMembers = newMembers };
    } else { { editorialMembers = old.editorialMembers } };
  };
};
