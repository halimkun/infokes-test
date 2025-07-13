import { test, expect } from "bun:test"

const folderBaseURL = "http://localhost:3000/api/v1/folders"

let folder1Id: number = 0
let folder2Id: number = 0
let subfolder1Id: number = 0
let subfolder2Id: number = 0

test("POST /folders → create Folder 1", async () => {
    const res = await fetch(folderBaseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Folder 1" }),
    })

    const data = await res.json()
    folder1Id = data.id
    
    expect(res.status).toBe(200)
    expect(folder1Id).toBeDefined()
})

test("POST /folders → create Folder 2", async () => {
    const res = await fetch(folderBaseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Folder 2" }),
    })

    const data = await res.json()
    folder2Id = data.id

    expect(res.status).toBe(200)
    expect(folder2Id).toBeDefined()
})

test("GET /folders → get all folders", async () => {
    const res = await fetch(folderBaseURL)
    
    const data = await res.json()
    
    expect(res.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(2)
})

test("GET /folders/:id → get Folder 1 by id", async () => {
    const res = await fetch(`${folderBaseURL}/${folder1Id}`)

    const data = await res.json()
    
    expect(res.status).toBe(200)
    expect(data.id).toBe(folder1Id)
    expect(data.name).toBe("Folder 1")
})

test("PUT /folders/:id → update Folder 2", async () => {
    const res = await fetch(`${folderBaseURL}/${folder2Id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Folder 2 Updated" }),
    })

    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.name).toBe("Folder 2 Updated")
})

test("POST /folders → create Subfolder 1 in Folder 1", async () => {
    const res = await fetch(folderBaseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Subfolder 1", parentId: folder1Id }),
    })

    const data = await res.json()
    subfolder1Id = data.id

    expect(res.status).toBe(200)
    expect(data.parentId).toBe(folder1Id)
    expect(data.name).toBe("Subfolder 1")
})

test("POST /folders → create Subfolder 2 in Folder 1", async () => {
    const res = await fetch(folderBaseURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Subfolder 2", parentId: folder1Id }),
    })

    const data = await res.json()
    subfolder2Id = data.id
    
    expect(res.status).toBe(200)
    expect(data.parentId).toBe(folder1Id)
    expect(data.name).toBe("Subfolder 2")
})

test("GET /folders/parent/:parentId → get subfolders of Folder 1", async () => {
    const res = await fetch(`${folderBaseURL}/parent/${folder1Id}`)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(2)

    const subfolderNames = data.map((f: any) => f.name)
    expect(subfolderNames).toContain("Subfolder 1")
    expect(subfolderNames).toContain("Subfolder 2")
})

test("DELETE /folders/:id → delete Folder 1 (with subfolders)", async () => {
    const res = await fetch(`${folderBaseURL}/${folder1Id}`, {
        method: "DELETE",
    })

    expect(res.status).toBe(200)
})

test("DELETE /folders/:id → delete Folder 2", async () => {
    const res = await fetch(`${folderBaseURL}/${folder2Id}`, {
        method: "DELETE",
    })

    expect(res.status).toBe(200)
})