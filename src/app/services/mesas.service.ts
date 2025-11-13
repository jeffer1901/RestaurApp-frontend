import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MesasService {
  private apiUrl = 'http://localhost:8080/mesas';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return new HttpHeaders();

    const user = JSON.parse(storedUser);
    const token = user.token;

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  obtenerMesas(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  obtenerMesaPorId(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  agregarMesa(mesa: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, mesa, { headers });
  }

  actualizarMesa(id: number, mesa: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/${id}`, mesa, { headers });
  }

  eliminarMesa(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
  liberarMesa(id: number): Observable<string> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/liberar/${id}`, null, { headers, responseType: 'text' });
  }
}
