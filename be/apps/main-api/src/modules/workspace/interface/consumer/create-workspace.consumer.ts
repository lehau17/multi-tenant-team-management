import { OnEventConsumer } from "@app/shared/decorator/event-listener.decorator";
import { Controller } from "@nestjs/common";

@Controller()
export class CreateWorkspaceConsumer {



  @OnEventConsumer("workspace.created")
  handleEvent(msg:any, ack : ()=> Promise<void>) {
    console.log("Check event", msg, typeof msg)
  }
}
