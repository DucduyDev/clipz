import firebase from 'firebase/compat/app';

interface IClip {
  docID?: string;
  uid: string;
  displayName: string;
  clipURL: string;
  screenshotURL: string;
  title: string;
  fileName: string;
  screenshotName: string;
  timestamp: firebase.firestore.FieldValue;
}

export default IClip;
