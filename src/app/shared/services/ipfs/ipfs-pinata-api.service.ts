import {Observable} from 'rxjs'
import {HttpClient} from '@angular/common/http'
import {environment} from '../../../../environments/environment'
import {map} from 'rxjs/operators'
import {IPFSAddResult, IPFSApi} from './ipfs.service.types'

export class IpfsPinataApiService implements IPFSApi {
  constructor(private http: HttpClient) {
  }

  addFile(file: File): Observable<IPFSAddResult> {
    const formData = new FormData()
    formData.append('file', file, file.name)

    return this.pinFileToIPFS(formData)
  }

  addObject(data: object): Observable<IPFSAddResult> {
    const formData = new FormData()
    formData.append('file', new Blob([JSON.stringify(data)], {
      type: 'application/json',
    }), 'data.json')

    return this.pinFileToIPFS(formData)
  }


  private pinFileToIPFS(formData: FormData): Observable<IPFSAddResult> {
    return this.http.post<PinataPinResponse>(`${environment.ipfs.pinataApiURL}/pinning/pinFileToIPFS`, formData, {
      headers: {
        Authorization: `Bearer ${environment.ipfs.pinataApiToken}`,
      },
    }).pipe(
      map(res => ({path: res.IpfsHash, size: res.PinSize})),
    )
  }
}

interface PinataPinResponse {
  IpfsHash: string
  PinSize: number,
  Timestamp: Date
}
