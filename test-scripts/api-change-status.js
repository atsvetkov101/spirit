
const API_URL = 'http://localhost:3000/api/mobile/v1/change-status';

const data = {
  ticketId: 'cb36cf5c-7fb6-4dc2-a9d3-6887ca75541e',
  serviceId: 'd9251dd3-b4ed-43f2-86b4-5807fc825e6c',
  checkList: {
    works: [
      {
        id: '398d2bed-82e6-47bd-85f7-ff2842a88b1a',
        action: 'диагностика устройства',
        actionData: {
          deviceId: 'd4f8ac1b-c026-43f9-b3be-9d5aa680782d'
        }
      },
      {
        id: 'a9738647-0aad-4748-81d0-256a75d5654c',
        action: 'демонтаж устройства',
        actionData: {
          deviceId: 'd4f8ac1b-c026-43f9-b3be-9d5aa680782d'
        }
      }
    ]
  }
};
async function apiChangeStatus() {

}

apiChangeStatus();
