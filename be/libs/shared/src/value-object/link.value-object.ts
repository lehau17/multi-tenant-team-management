import { CommonTypeValueObject, ValueObject } from "../core";

export class LinkVo extends ValueObject<CommonTypeValueObject>{
  constructor(
    props : CommonTypeValueObject
  ) {
    super(props)
  }




  static create(link: string | null): LinkVo | null {
    if(!link) return null
    //validate
    if (link.startsWith("http://") || link.startsWith("https://")) {
      // Throw error
    }
    return new LinkVo({value : link})
  }

}
